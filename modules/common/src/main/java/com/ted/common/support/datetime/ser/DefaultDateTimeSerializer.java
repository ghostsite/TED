package com.ted.common.support.datetime.ser;

import java.io.IOException;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class DefaultDateTimeSerializer extends StdSerializer<DateTime> {
    final static DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public void serializeWithType(DateTime value, JsonGenerator jgen, SerializerProvider provider, TypeSerializer typeSer) throws IOException, JsonProcessingException {
        typeSer.writeTypePrefixForScalar(value, jgen);
        serialize(value, jgen, provider);
        typeSer.writeTypeSuffixForScalar(value, jgen);
    }

    public DefaultDateTimeSerializer() {
        super(DateTime.class);
    }

    @Override
    public void serialize(DateTime value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonGenerationException {
        if (provider.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)) {
            jgen.writeNumber(value.getMillis());
        } else {
            jgen.writeString(formatter.print(value));
        }
    }

    @Override
    public JsonNode getSchema(SerializerProvider provider, java.lang.reflect.Type typeHint) {
        return createSchemaNode(provider.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS) ? "number" : "string", true);
    }
}
