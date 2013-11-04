package com.observers.model;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import lombok.NoArgsConstructor;

import java.io.Reader;
import java.lang.reflect.Type;
import java.util.Date;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Key;
import com.observers.json.ChannelSerializer;
import org.loom.appengine.json.*;

/**
 * Adds JSON serialization and deserialization to a class.  Uses Gson as the
 * underlying serialization mechanism.  Also adds java.util.Date serialization
 * and deserialization.
 *
 * @author vicfryzel@google.com (Vic Fryzel)
 * @author cartland@google.com (Chris Cartland)
 */
@NoArgsConstructor
public abstract class Jsonifiable {
  public static String kind = "observers#jsonifiable";

  /**
   * JSON serializer for java.util.Date, required when serializing larger
   * objects containing Date members.
   */
  public static final JsonSerializer<Date> DATE_SERIALIZER
  = new JsonSerializer<Date>() {
    @Override
    public JsonElement serialize(Date src, Type typeOfSrc,
        JsonSerializationContext context) {
      try {
        return new JsonPrimitive(src.getTime());
      } catch (NullPointerException e) {
        return null;
      }
    }
  };

  /**
   * JSON deserializer for java.util.Date, required when deserializing larger
   * objects containing Date members.
   */
  public static final JsonDeserializer<Date> DATE_DESERIALIZER
  = new JsonDeserializer<Date>() {
    @Override
    public Date deserialize(JsonElement json, Type typeOfT,
        JsonDeserializationContext context) throws JsonParseException {
      try {
        return new Date(json.getAsLong());
      } catch (NullPointerException e) {
        return null;
      }
    }
  };

  public static final JsonSerializer<Link> LINK_SERIALIZER
  = new JsonSerializer<Link>() {
    @Override
    public JsonElement serialize(Link src, Type typeOfSrc,
        JsonSerializationContext context) {
      try {
        return new JsonPrimitive(src.getValue());
      } catch (NullPointerException e) {
        return null;
      }
    }
  };

  public static final JsonSerializer<Text> TEXT_SERIALIZER
  = new JsonSerializer<Text>() {
    @Override
    public JsonElement serialize(Text src, Type typeOfSrc,
        JsonSerializationContext context) {
      try {
        return new JsonPrimitive(src.getValue());
      } catch (NullPointerException e) {
        return null;
      }
    }
  };

  public static final JsonSerializer<GeoPt> GEOPT_SERIALIZER
  = new JsonSerializer<GeoPt>() {
    @Override
    public JsonElement serialize(GeoPt src, Type typeOfSrc,
        JsonSerializationContext context) {
      try {
        JsonObject json = new JsonObject();
        json.addProperty("lat", src.getLatitude());
        json.addProperty("lng", src.getLongitude());
        return json;
      } catch (NullPointerException e) {
        return null;
      }
    }
  };
  
  /**
   * Gson object to use in all serialization and deserialization.
   */
  public static final Gson GSON = new GsonBuilder()
      .excludeFieldsWithoutExposeAnnotation()
      .registerTypeAdapter(Date.class, Jsonifiable.DATE_SERIALIZER)
      .registerTypeAdapter(Date.class, Jsonifiable.DATE_DESERIALIZER)
      .registerTypeAdapter(Link.class, Jsonifiable.LINK_SERIALIZER)
      .registerTypeAdapter(Text.class, Jsonifiable.TEXT_SERIALIZER)
      .registerTypeAdapter(GeoPt.class, Jsonifiable.GEOPT_SERIALIZER)
      .registerTypeAdapter(Channel.class, new ChannelSerializer())
      .create();

      /*
      .registerTypeAdapter(GeoPt.class, new GeoPtSerializer())
      .registerTypeAdapter(GeoPt.class, new GeoPtDeserializer())
      .registerTypeAdapter(Link.class, new LinkSerializer())
      .registerTypeAdapter(Link.class, new LinkDeserializer())
      .registerTypeAdapter(Text.class, new TextSerializer())
      .registerTypeAdapter(Text.class, new TextDeserializer())
      .registerTypeAdapter(Key.class, new KeySerializer())
      .registerTypeAdapter(Key.class, new KeyDeserializer())*/

  /**
   * @param json Object to convert to instance representation.
   * @param clazz Type to which object should be converted.
   * @return Instance representation of the given JSON object.
   */
  public static <T> T fromJson(String json, Class<T> clazz) {
    return GSON.fromJson(json, clazz);
  }

  /**
   * @param reader Reader from which to read JSON string.
   * @param clazz Type to which object should be converted.
   * @return Instance representation of the given JSON object.
   */
  public static <T> T fromJson(Reader reader, Class<T> clazz) {
    return GSON.fromJson(reader, clazz);
  }

  /**
   * @return JSON representation of this instance.
   */
  public String toJson() {
    return GSON.toJson(this);
  }

  /**
   * @return this.toJson()
   */
  @Override
  public String toString() {
    return toJson();
  }
}
