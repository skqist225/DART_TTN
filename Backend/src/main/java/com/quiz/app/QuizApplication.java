package com.quiz.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@ComponentScan({ "com.quiz.app" })
@EntityScan({ "com.quiz.entity" })
@RestController
public class QuizApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		System.out.println(60/60);
		SpringApplication.run(QuizApplication.class, args);
	}
}
