# BuildSmart Backend (Spring Boot)

This is the backend for the BuildSmart project, powered by Spring Boot.

## How to set up

1. Open https://start.spring.io/
2. Set the following:
   - Project: Maven
   - Language: Java
   - Group: com.example
   - Artifact: buildsmart
   - Name: buildsmart
   - Package name: com.example.buildsmart
   - Packaging: Jar
   - Java: 17 (or your preferred version)
   - Dependencies: Spring Web
3. Click "Generate" to download the starter zip.
4. Extract the contents into this `backend` folder.

## Sample Controller

After extracting, add the following Java file to `src/main/java/com/example/buildsmart/ConstructionController.java`:

```java
package com.example.buildsmart;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ConstructionController {
    @GetMapping("/api/projects")
    public String[] getProjects() {
        return new String[] {
            "Green Tower - Smart Apartments",
            "EcoMall - Sustainable Shopping Center",
            "Skyline Office Complex"
        };
    }
}
```

## Running the Backend

From this folder, run:

```
./mvnw spring-boot:run
```

or (if using Gradle):

```
./gradlew bootRun
```

Your backend will be available at http://localhost:8080

---

You can now connect your React frontend to this backend!
