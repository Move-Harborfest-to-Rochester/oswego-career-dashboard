package com.senior.project.backend.common.models;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.util.Iterator;
import java.util.UUID;

@Data
public class PatchOperation<TData> {
    private String op;
    private UUID id;
    private TData value;

    public TData applyTo(TData dataToUpdate) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String json = objectMapper.writeValueAsString(this.value);

            JsonNode sourceNode = objectMapper.readTree(json);

            for (Iterator<String> it = sourceNode.fieldNames(); it.hasNext(); ) {
                String fieldName = it.next();
                JsonNode fieldValue = sourceNode.get(fieldName);

                if (!fieldValue.isNull()) {
                    java.lang.reflect.Field targetField = dataToUpdate.getClass().getDeclaredField(fieldName);
                    targetField.setAccessible(true);
                    targetField.set(dataToUpdate, objectMapper.treeToValue(fieldValue, targetField.getType()));
                }
            }

            return dataToUpdate;
        } catch (JsonProcessingException | NoSuchFieldException | IllegalAccessException e) {
            throw new IllegalArgumentException("Invalid patch operation", e);
        }
    }
}