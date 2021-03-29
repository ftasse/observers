package org.loom.appengine.json;

import java.io.IOException;

import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.JsonToken;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.JsonDeserializer;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

/**
 * Used by jackson to serializes a {@link Key} instance to its String representation
 * @author Nacho
 *
 */
public class KeyDeserializer extends JsonDeserializer<Key> {

    @Override
    public Key deserialize(JsonParser jp, DeserializationContext ctxt)
        throws IOException, JsonProcessingException
    {
        JsonToken curr = jp.getCurrentToken();
        // Usually should just get string value:
        if (curr == JsonToken.VALUE_STRING || curr.isScalarValue()) {
            return KeyFactory.stringToKey(jp.getText());
        }
        throw ctxt.mappingException(Key.class);
    }

}
