package com.observers.model;

import static com.observers.model.OfyService.ofy;

import java.lang.reflect.Type;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonParseException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class ChannelJsonSerializer implements JsonSerializer<Channel> {

  private static final Gson gsonWithoutChannelSerializer = new Gson();


  public JsonElement serialize(final Channel channel, final Type typeOfSrc, final JsonSerializationContext context) {

  	try {
  		final JsonElement json = gsonWithoutChannelSerializer.toJsonTree(channel);

  		Long accountId = channel.getAccountId();
  		if (accountId != null)
  		{
  			if (channel.getSource() == Channel.Source.Twitter)
  			{
  				TwitterAccount account = ofy().load().type(TwitterAccount.class).id(accountId).get();
  				final JsonElement accountElement = context.serialize(account);
  				json.getAsJsonObject().add("account", accountElement);

  			} else if (channel.getSource() == Channel.Source.Facebook)
  			{
  				FacebookAccount account = ofy().load().type(FacebookAccount.class).id(accountId).get();
  				final JsonElement accountElement = context.serialize(account);
  				json.getAsJsonObject().add("account", accountElement);
  			}
  		}

  		return json;
  	} catch (NullPointerException e) {
  		return null;
  	}
  }
}