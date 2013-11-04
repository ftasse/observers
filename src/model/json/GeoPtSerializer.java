package org.loom.appengine.json;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

import com.google.appengine.api.datastore.GeoPt;

public class GeoPtSerializer extends JsonSerializer<GeoPt> {
	
	@Override
	public void serialize(GeoPt geopt, JsonGenerator jgen,
			SerializerProvider serializerProvider) throws IOException,
			JsonProcessingException {
		jgen.writeStartObject();
		jgen.writeNumberField("lat", geopt.getLatitude());
		jgen.writeNumberField("lng", geopt.getLongitude());
		jgen.writeEndObject();
	}

}
