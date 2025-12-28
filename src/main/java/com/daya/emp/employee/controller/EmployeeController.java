package com.daya.emp.employee.controller;

import com.daya.emp.employee.model.Employee;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private final Environment env;

    public EmployeeController(Environment env) {
        this.env = env;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Welcome to Demo";
    }

    @GetMapping("/employees")
    public List<Employee> employees() {
        return Arrays.asList(
                new Employee(1L, "Alice", "Developer"),
                new Employee(2L, "Bob", "Manager"),
                new Employee(3L, "Carol", "QA")
        );
    }

    @GetMapping("/profile")
    public List<String> activeProfiles() {
        String[] profiles = env.getActiveProfiles();
        if (profiles == null || profiles.length == 0) {
            return Collections.singletonList("default");
        }
        return Arrays.asList(profiles);
    }

    @GetMapping("/envmsg")
    public String environmentMessage() {
        // Read the property 'poc.environment.msg' from the active environment (application-*.properties)
        String msg = env.getProperty("poc.environment.msg")+"added to test ci/cd"+"testing deploy";
        return msg != null ? msg : "";
    }
}
