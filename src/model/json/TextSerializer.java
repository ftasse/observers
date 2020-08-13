package org.loom.appengine.json;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

import com.google.appengine.api.datastore.Text;

public class TextSerializer extends JsonSerializer<Text> {

	@Override
	public void serialize(Text text, JsonGenerator jgen, SerializerProvider arg2)
			throws IOException, JsonProcessingException {
		jgen.writeString(text.getValue());
	}

}
