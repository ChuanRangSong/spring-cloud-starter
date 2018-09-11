package com.alibaba.user.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "用户信息")
@RestController
@RequestMapping("user")
public class UserController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${username}")
    private String username;

    @ApiOperation("根据id查询用户")
    @RequestMapping(value = "/{id}", method = {RequestMethod.POST})
    public void findById(@ApiParam(name = "id", type = "path", required = true) @PathVariable("id") int id) {
        logger.info("id:{}", id);
        logger.info("username:{}", username);
    }

}
