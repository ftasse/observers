package org.loom.appengine.json;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

/**
 * Used by jackson to serializes a {@link Key} instance to its String representation
 * @author Nacho
 *
 */
public class KeySerializer extends JsonSerializer<Key> {

	@Override
	public void serialize(Key value, JsonGenerator jgen,
			SerializerProvider provider) throws IOException,
			JsonProcessingException {
		jgen.writeString(KeyFactory.keyToString(value));
	}

}
