# Observers platform

Live version: [here](https://observers-v2.herokuapp.com)

Observers is an easy, accessible and smart platform that shows the world what people are feeling about an issue, where they are and what are their concerns.  Here, you can see reports about various topics, send your own report, or even create a topic you are passionate about!

Often, the news are not the true reflection of what is going on around us. People are. So, Observers is a platform that allows people, to share their stories and attach media to support it. 

## Our motivation
Often, the news are not the true reflection of what is going on around us. People are. So, Observers is a platform that allows people, to share their stories and attach media to support it. Not-for-profit organizations can leverage this tool for advocacy campaigns, to persuade policy makers of a nation to take action to solve a given problem. Topics or problems are infinite, in the Global South and in the rest of the world. Here are a few examples of some issues:

* Problematic elections
* The consequences of deforestation in a region
* Suffering of the people due to impassable roads
* Waterborne diseases due to lack of drinking water
* Corruption on the roads,
* Corruption in public services
* Education
* Barriers to the creation and operation of private enterprises
* Urban pollution , etc

These are all issues that some of us face everyday. By sharing their testimonies with everyone, they can join forces to make a real change. The more evidence will be numerous and poignant, the more policy makers will be affected.

## How does it work?

There are a few existing platforms that allow citizens to submit reports about issues that concern them. However, Observers allow anyone with a Google account to create a topic in one click. So whether, the issue is localized to a small community or affecting a whole continent, starting a topic to collect reports and testimonies is easy. We have also made the website responsive to different devices. So whether you are using a phone, a tablet or a PC, you will still get a great experience.

## Mode of transmission
We see Twitter as a game changer in how people share their stories. Already, it has been very instrumental in a lot of important changes around the world, from the shear power of people's voices. So we added support for pulling Tweets related to specific users or hashtags.

Because some parts of the world have little to no internet connectivity, we have added support for reports by SMS. People can share their stories by sending SMS containing a keyword to a phone number configured during topic creation. We will soon add support for custom phone numbers. The keyword (or hashtag) identifies the topic the report is aimed at. The creator of the topic decides what this keyword is.

Along, with the web form available from each topic's dashboard, these three modes of communication allows a wide range of users to participate, whether they are in the centre of Manhattan or the Batcham village in the West of Cameroon.

## Sentiment Analysis

Understanding the sentiment of the crowd is key in evaluating an issue. So we analyze every report that does not have any sentiment information attached and predict whether it is Positive, Negative or Neutral. Hence, at first glance on the topic's dashboard, users can see what the opinion of the crowd is.

## Geolocation
We display the location from which each report was sent so that users can get a sense of how people's report differ from one location to another. Clicking on a map pin will show a report sent from within a neighborhood of that location.


## Using the open-source code

The only dependency library you need to run this on your local environment is the GAE Api  (as listed in  ant build file `build.xml`) in the parent directory of your project folder. 
