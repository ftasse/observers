package org.loom.appengine.json;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

import com.google.appengine.api.datastore.Link;

public class LinkSerializer extends JsonSerializer<Link> {

	@Override
	public void serialize(Link link, JsonGenerator jgen, SerializerProvider arg2) throws IOException, JsonProcessingException {
		jgen.writeString(link.getValue());
	}

}
