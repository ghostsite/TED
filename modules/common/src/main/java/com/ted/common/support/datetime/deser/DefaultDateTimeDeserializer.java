package com.ted.common.support.datetime.deser;

import java.io.IOException;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.ReadableDateTime;
import org.joda.time.ReadableInstant;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.datatype.joda.deser.DateTimeDeserializer;

public class DefaultDateTimeDeserializer extends DateTimeDeserializer {
    DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");

    public DefaultDateTimeDeserializer(Class<? extends ReadableInstant> cls) {
        super(cls);
    }

    private static final long serialVersionUID = 1L;

    @Override
    public ReadableDateTime deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        JsonToken t = jp.getCurrentToken();
        if (t == JsonToken.VALUE_NUMBER_INT) {
            return new DateTime(jp.getLongValue(), DateTimeZone.UTC);
        }
        if (t == JsonToken.VALUE_STRING) {
            String str = jp.getText().trim();
            if (str.length() == 0) { // [JACKSON-360]
                return null;
            }
            //return new DateTime(str, DateTimeZone.UTC);
            formatter.parseDateTime(str);
        }
        throw ctxt.mappingException(getValueClass());
    }
}
