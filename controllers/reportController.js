const axios = require('axios');
const factory = require('./handlerFactory');
const Report = require('../models/reportModel');
const Topic = require('../models/topicModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const getCoordsFromCityName = async (city, country) => {
  try {
    const dataQuestToken = process.env["MAPQUEST_TOKEN"];
    var url = `https://www.mapquestapi.com/geocoding/v1/address?key=${dataQuestToken}&inFormat=kvp&outFormat=json&city=${encodeURIComponent(city)}&maxResults=1`;
    if country: url = url + `&country={encodeURIComponent(country)}`;
    const res = await axios({
      method: 'GET',
      url: url
    });
    if (res.status === 200) {
      const name = [
        res.data.results[0].locations[0].adminArea1,
        res.data.results[0].locations[0].adminArea3,
        res.data.results[0].locations[0].adminArea5
      ];
      const locationLatLng = res.data.results[0].locations[0].latLng;
      return {
        coordinates: [locationLatLng.lng, locationLatLng.lat],
        address: name.join('|')
      };
    }
  } catch (err) {
    console.log(err);
    console.log("Failed to find GPS coordinates from city name: ", city);
    // showAlert('failed', 'Please provide a valid location');
    return null;
  }
}

exports.setTopicId = (req, res, next) => {
  if (!req.body.topic) req.body.topic = req.params.topicId;

  next();
};

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.setReportFromWhatsApp = (req, res, next) => { 
  if (req.body.AccountSid != process.env['TWILIO_ACCOUNTSID']) {
   return next(
      new AppError(
        'Attempt to request a report on a topic using an unknown messaging platform. Operation can not be performed',
        404
      )
    );
  }
  if (!req.body.user && req.user) req.body.user = req.user.id;
  if (!req.body.user) req.body.user = "61ffe41ab8fdccce21045088"; // anonymous whatsapp_user
  req.body.author = req.body.user;

  msg_content_tokens = req.body.Body.split(":");
  metadata = msg_content_tokens[0].split('/');
  if (metadata.length > 1) {
   topicCode = metadata[0].toLowerCase().replace("-","").trim();
   if (topicCode == "droitshumains" || topicCode == "humanrights") {
     req.body.topic = "5f986356291678001796b16b";
     req.body.country = "Cameroon";
   }
   req.body.topicCode = topicCode
   metadata = metadata.splice(1);
  }
  if (!req.body.topic || metadata.length == 0) {
    const twiml = new MessagingResponse();
    twiml.message('Invalid.  Use the format subject_code/city: report. Utilisez le format code_sujet/ville: rapport.');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
    return;
  }
  msg = metadata+':'+msg_content_tokens.splice(1).join(":")
  req.body.content = msg.trim();

  //  exports.replyToWhatsAppReport(req, res, next);

  next();
};

exports.replyToWhatsAppReport = catchAsync(async (req, res, next) => {
  if (req.body.SmsMessageSid) {
    const topic = await Topic.findById(req.body.topic);
    const twiml = new MessagingResponse();
    twiml.message(`"${topic.title.trim()}": Your report was well received. Votre rapport a été bien recu.`);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } else next();
});

exports.getAllReport = factory.getAll(Report);
exports.getReport = factory.getOne(Report);
exports.createReport = catchAsync(async (req, res, next) => {
  const topic = await Topic.findById(req.body.topic);
  if (!topic) {
    return next(
      new AppError(
        'Attempt to report on a topic that does not exist. Operation can not be performed',
        404
      )
    );
  }
  msg_content_tokens = req.body.content.split(":");
  if (!req.body.location && msg_content_tokens.length > 1) {
    city = msg_content_tokens[0].trim();
    msg = req.body.content; // msg_content_tokens.splice(1).join(":").trim(); 
    const location = await getCoordsFromCityName(city, req.body.country);
    if (!location) msg = req.body.content;
    else {
      location.description = location.address;
      location.type = 'Point';
      delete location.address;
      req.body.content = msg;
      req.body.location = location;
    }
  }
  await factory.createOne(Report)(req, res, next);
});
exports.updateReport = factory.updateOne(Report);
exports.deleteReport = factory.deleteOne(Report);
exports.getReportsWithin = factory.getAllWithin(Report);
