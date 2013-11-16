from time import gmtime, strftime
import time
import calendar
import difflib
import csv
from pygeocoder import Geocoder

from HTMLParser import HTMLParser
from htmlentitydefs import name2codepoint

import urllib2
import pickle
import codecs;
import json
import codecs 
from json import JSONEncoder

# {
# "id":6447536185278464,
# "content":"Electoral fraud in Cameroun!!!",
# "topicId":6095692464390144,
# "channelId":5321636278435840,
# "channelReportId":"1383862580511",
# "authorId":"5629499534213120",
# "mediaUrls":[
# "http://www.cl.cam.ac.uk/~fp289"
# ],
# "numVotes":0,
# "mood":"Neutral",
# "location":{
# "lat":48.85341,
# "lng":2.3488
# },
# "created":1383862580511,
# "retrieved":1383862580511
# }

def newGeoPt(lat, lng):
    geoPt = {}
    geoPt['lat'] = lat
    geoPt['lng'] = lng
    return geoPt

def newReport():
    report = {}
    report['title']=None
    report['content'] = None
    report['channelReportId'] = None
    report['location'] = None
    report['created'] = None
    report['mood'] = None
    return report

def cleandict(d):
    if not isinstance(d, dict):
        return d
    return dict((k,cleandict(v)) for k,v in d.iteritems() if v is not None)
    
reports = []
supported = ['report-title', 'date', 'location', 'report-description-text']
tagtypes = []
reportId = 0
report_urls = []
training_mood_model = None

class ListHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
    
    def handle_starttag(self, tag, attrs):
        saveUrl = False
        #print "Tag: ", tag, attrs
        for attr in attrs:
            if (len(attr) == 2 and attr[1] == 'r_title'):
                saveUrl = True
            elif (len(attr) == 2 and attr[0] == 'href'):
                if (saveUrl):
                    report_urls.append(attr[1])
                    print attr[1]

class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.cur_report  = newReport()
    
    def feed(self, html):
        self.cur_report  = newReport()
        HTMLParser.feed(self, html)

    def handle_starttag(self, tag, attrs):
        tagtype = 0
        #print "Start tag:", tag
        for attr in attrs:
            #print "Check", attr[1]
            if (len(attr) == 2 and attr[1] in supported):
                tagtype = attr[1]
                #print "Class", tagtype
        tagtypes.append(tagtype)        
    
    def handle_endtag(self, tag):
        #print "End tag Again :", tagtypes
        if (tagtypes[len(tagtypes)-1] == 'report-description-text'):
            if self.cur_report['title'] != None:
                #self.cur_report.channelReportId = str(len(reports)+1)
                reports.append(cleandict(self.cur_report))
                #self.cur_report = Report()
                #print "Report:", self.cur_report['title']
                #print "End tag  :", json.dumps(self.cur_report)
        tagtypes.pop()
    
    def handle_data(self, data):
        #print tagtypes
        if (len(tagtypes)>0):
            data = data.strip()
            if (data == ""):
                return
            
            if tagtypes[len(tagtypes)-1] == 'report-title':
                self.cur_report['title'] = data.strip()
            #print "Data :", self.cur_report['title']
            elif (tagtypes[len(tagtypes)-1] == 'report-description-text'):
                self.cur_report['content'] = data.strip()
            elif (tagtypes[len(tagtypes)-1] == 'date'):
                if (data == "00:00 Jan 1 1970"):
                    data = "00:00 Oct 1 2013"
                    print "Use a default date!"
                created = time.strptime(data, "%H:%M %b %d  %Y")
                self.cur_report['created'] = calendar.timegm(created)
            elif (tagtypes[len(tagtypes)-1] == 'location'):
                try:
                    results = Geocoder.geocode(data + ", Cameroon")
                    if (len(results) > 0):
                        self.cur_report['location'] = newGeoPt(results[0].coordinates[0], results[0].coordinates[1])
                except :
                    print "Could not find location for: ", data
                    pass
parser = MyHTMLParser()
list_parser = ListHTMLParser()


def loadTrainingData():
    model = []
    with open('Elections.csv', 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            #print ', '.join(row)
            val = row #[unicode(cell, 'utf-8') for cell in row]
            model.append(val[0][0] + " " +  val[1])
            #print model[-1]
    return model

def getMood(text):
    matches = difflib.get_close_matches(text, training_mood_model, n = 3,cutoff = 0.8)
    if len(matches) > 0:
        seq = ((e, difflib.SequenceMatcher(None, text, e).get_matching_blocks()[0]) for e in matches)
        seq = [k for k, _ in sorted(seq, key = lambda e:e[-1].size, reverse = True)]
        #print text, "\n", seq
        if matches[0][0] == 'n':
            return "Negative"
        elif matches[0][0] == 'p':
            return "Positive"
    else:
        return "Unknown"

def getReportUrls():
    with open('report_urls.pkl', 'r') as f:
        report_urls = pickle.load(f)
        #print report_urls
        return report_urls
    
    base_url = "http://cameroonelection.org/reports/fetch_reports?page="
    page_id = 1
    prev_html = ""
    while True:
        page_url = base_url+str(page_id)
        response = urllib2.urlopen(page_url)
        if response.getcode() != 200:
            print "Fail to load: ", page_url
            break
        else:
            print "Processing:", page_url
        html = response.read()
        if (prev_html == html):
            print "Loaded the same html as prev request: ", page_url
            break;
        else:
            prev_html = html
        list_parser.feed(html)
        response.close()  # best practice to close the file
        page_id += 1
    pickle.dump(report_urls, open('report_urls.pkl', 'w'))

def getReports(urls):
    with open('reports.pkl', 'r') as f:
        reports = pickle.load(f)
##        for r in reports:
##            try:
##                print r['title']
##            except KeyError:
##                print "ERROR: ", r
##                break
        return reports
    
    backup = open('reports_backup', 'w')
    backup.write("[");
    k = 1
    
    for url in urls:
        try:
            response = urllib2.urlopen(url)
            if response.getcode() != 200:
                print "Fail to load: ", url
                break
            else:
                print "Processing:" , url
            html = response.read()
            parser.feed(html)
            report = parser.cur_report
            report['channelReportId'] = url.split('/')[-1]
            report['mood'] = getMood(report['content'])
            report = cleandict(report)
            reports.append(report)
            print "\nAdded:", k, reports[-1] #json.dumps(reports[-1], encoding="utf8")
            response.close()  # best practice to close the file
            if (k>1):
                backup.write(", ")
            backup.write(json.dumps(reports[-1], ensure_ascii=False) + "\n")
        except:
            print "An unknown error has occured"
        k+=1
        
    backup.write("]")
    backup.close()
    pickle.dump(reports, open('reports.pkl', 'w'))

#with codecs.open('fetch_reports.html', encoding="utf8") as fin:
#    decoded = ListHTMLParser().unescape(fin.read())
#    #print urllib2.unquote(open('test.html', 'r').read())
    #text = HTMLParser().unescape(urllib2.unquote(open('test.html', 'r').read()))
#    list_parser.feed(decoded)
#    print report_urls

##with codecs.open('test.html', encoding="utf8") as fin:
##    page_url = "http://cameroonelection.org/reports/view/74"
##    decoded = HTMLParser().unescape(fin.read())
###    #print urllib2.unquote(open('test.html', 'r').read())
##    #text = HTMLParser().unescape(urllib2.unquote(open('test.html', 'r').read()))
##    parser.feed(decoded)
##    report = parser.cur_report
##    report['channelReportId'] = page_url.split('/')[-1]
##    report = cleandict(report)
##    reports.append(report)
##    print "\nAdded:  ", reports[-1] #json.dumps(reports[-1], en)
##    #print reports

#training_mood_model = loadTrainingData()
report_urls = getReportUrls()
#getReports(report_urls)

reports = getReports(None)

##ids = [page_url.split('/')[-1] for page_url in report_urls]
##fixed_reports = []
##
##for report in reports:
##    if 'channelReportId' in report.keys() and report['channelReportId'] in ids:
##        fixed_reports.append(report)
##
##reports = fixed_reports;
##pickle.dump(reports, open('reports.pkl', 'w'))

#print len(reports), len(report_urls)
#print reports
jsonData = json.dumps(reports, ensure_ascii=False)
#print jsonData
with open("reports_json", 'w') as f:
    f.write(jsonData)
