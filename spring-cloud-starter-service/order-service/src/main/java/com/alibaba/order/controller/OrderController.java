package com.alibaba.order.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("order")
public class OrderController {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping("/{id}")
    public void findById(@PathVariable() int id){
        logger.info("id : {}", id);
    }
}
