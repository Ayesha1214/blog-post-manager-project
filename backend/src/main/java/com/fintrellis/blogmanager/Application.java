package com.fintrellis.blogmanager;
import io.micronaut.runtime.Micronaut;
import io.micronaut.core.annotation.Introspected;
import jakarta.persistence.Entity; // Import Entity annotation
@Introspected(packages = "com.fintrellis.blogmanager", includedAnnotations = Entity.class)
public class Application {
    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}