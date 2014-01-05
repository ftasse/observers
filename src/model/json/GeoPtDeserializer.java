package org.loom.appengine.json;

import java.io.IOException;

import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.JsonToken;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.JsonDeserializer;

import com.google.appengine.api.datastore.GeoPt;

public class GeoPtDeserializer extends JsonDeserializer<GeoPt> {

	@Override
	public GeoPt deserialize(JsonParser jp, DeserializationContext ctxt)
			throws IOException, JsonProcessingException {
		// Sanity check: verify that we got "Json Object":
		if (jp.nextToken() != JsonToken.START_OBJECT) {
			throw new IOException("Expected data to start with an Object");
		}
		float lat = 0;
		float lng = 0;
		while (jp.nextToken() != JsonToken.END_OBJECT) {
			String fieldName = jp.getCurrentName();
			// Let's move to value
			jp.nextToken();
			if (fieldName.equals("lat")) {
				lat = jp.getFloatValue();
			} else if (fieldName.equals("lng")) {
				lng = jp.getFloatValue();
			} else { // ignore, or signal error?
				throw new IOException("Unrecognized field '" + fieldName + "'");
			}
		}
		jp.close(); // important to close both parser and underlying File reader
		return new GeoPt(lat, lng);
	}

}
