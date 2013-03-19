package com.ted.common.support.datetime.ser;

import java.io.IOException;

import org.joda.time.LocalDateTime;
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

public class DefaultLocalDateTimeSerializer extends StdSerializer<LocalDateTime> {

    final static DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");

    public DefaultLocalDateTimeSerializer() {
        super(LocalDateTime.class);
    }

    @Override
    public void serializeWithType(LocalDateTime value, JsonGenerator jgen, SerializerProvider provider, TypeSerializer typeSer) throws IOException, JsonProcessingException {
        typeSer.writeTypePrefixForScalar(value, jgen);
        serialize(value, jgen, provider);
        typeSer.writeTypeSuffixForScalar(value, jgen);
    }

    @Override
    public void serialize(LocalDateTime value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonGenerationException {
        if (provider.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)) {
            jgen.writeNumber(value.getMillisOfSecond());
        } else {
            jgen.writeString(formatter.print(value));
        }
    }

    @Override
    public JsonNode getSchema(SerializerProvider provider, java.lang.reflect.Type typeHint) {
        return createSchemaNode(provider.isEnabled(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS) ? "array" : "string", true);
    }

}
