FROM eclipse-temurin:17-jdk
WORKDIR /app

ARG JAR_FILE=target/employee.jar
COPY ${JAR_FILE} /app/employee.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/employee.jar"]
