package com.alibaba.order.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@Api(tags = "订单相关操作")
@RestController
@RequestMapping("order")
public class OrderController {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @ApiOperation(value = "根据id查询订单")
    @RequestMapping(value = "findById/{id}", method = {RequestMethod.POST})
    public void findById(@ApiParam(name = "id", type = "path") @PathVariable() int id){
        logger.info("id : {}", id);
    }
}
