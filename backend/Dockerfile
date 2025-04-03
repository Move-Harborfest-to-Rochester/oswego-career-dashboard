FROM openjdk:17-oracle
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} api/app.jar
WORKDIR /api
EXPOSE 8080/tcp
ENTRYPOINT ["java","-jar","./app.jar"]