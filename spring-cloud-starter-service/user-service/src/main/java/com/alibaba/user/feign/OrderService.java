package com.alibaba.user.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "order-service")
public interface OrderService {
    @RequestMapping(value = "order/findById/{id}", method = {RequestMethod.POST})
    void findById(@PathVariable("id") int id);
}
