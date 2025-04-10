plugins {
    java
    id("jacoco")
    id("org.springframework.boot") version "3.1.4"
    id("io.spring.dependency-management") version "1.1.3"
}

group = "com.senior.project"
version = "0.0.1"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    implementation("org.springframework.boot:spring-boot-starter-webflux")


    implementation ("com.github.java-json-tools:json-patch:1.13")

    // email
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")

    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.20")
    annotationProcessor("org.projectlombok:lombok:1.18.20")
    implementation("org.projectlombok:lombok:1.18.28")

    // Security
    implementation("org.bitbucket.b_c:jose4j:0.6.0")
    implementation("com.google.api-client:google-api-client:1.32.1")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // Spring Boot Starter Data JPA
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    // Database driver
    implementation("mysql:mysql-connector-java:8.0.33")
    // Flyway
    implementation("org.flywaydb:flyway-mysql")
    implementation("org.flywaydb:flyway-core")

    // Validation
    implementation("jakarta.validation:jakarta.validation-api:3.0.0")
    implementation("org.hibernate.validator:hibernate-validator:8.0.1.Final")
    implementation("org.hibernate.validator:hibernate-validator-annotation-processor:8.0.1.Final")
    testImplementation("org.glassfish:jakarta.el:4.0.2")

    // Test dependecies
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.mockito:mockito-core")

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("mysql:mysql-connector-java")
    implementation("com.fasterxml.jackson.core:jackson-databind")

}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.test {
    finalizedBy(tasks.jacocoTestReport) // Generate the report after running tests
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    group = "Reporting"
    description = "Generate Jacoco coverage reports"

    classDirectories.setFrom(
        files(classDirectories.files.map {
            fileTree(it) {
                exclude(
                    "**/BackendApplication.class",
                    "**/MicrosoftKeyset.class",
                    "**/util/**",
                    "**/*Router.class",
                    "**/SecurityConfig.class",
                    "**/*Builder.class"
                )
            }
        })
    )
}


tasks.register("setupEnvironmentVariables") {

    // For runtime check see backend/src/main/java/com/senior/project/backend/BackendApplication.java
    // Add any other required environment variables here
    val envVars = listOf("CRD_DB_PASSWORD", "EMAIL_PASSWORD", "CRD_SUPER_ADMIN")

    val missingVars = mutableListOf<String>()
    envVars.forEach {
        System.getenv(it)?: missingVars.add(it)
    }
    if (missingVars.isNotEmpty()) {
        throw IllegalStateException("Required environment variables are not defined: $missingVars")
    }
}

tasks.named("bootRun") {
    dependsOn("setupEnvironmentVariables")
}
