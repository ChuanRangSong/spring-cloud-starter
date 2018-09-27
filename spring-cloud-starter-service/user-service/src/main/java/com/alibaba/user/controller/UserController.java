package com.alibaba.user.controller;

import com.alibaba.user.feign.OrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

@Api(tags = "用户信息")
@RestController
@RequestMapping("user")
public class UserController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Resource
    private OrderService orderService;

    @ApiOperation("根据id查询用户")
    @RequestMapping(value = "/{id}", method = {RequestMethod.POST})
    public void findById(@ApiParam(name = "id", type = "path", required = true) @PathVariable("id") int id) {
        logger.info("id:{}", id);
        orderService.findById(id);
    }

}
