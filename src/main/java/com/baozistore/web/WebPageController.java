package com.baozistore.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebPageController {

    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    @GetMapping("/clientes-web")
    public String clientesWeb() {
        return "forward:/clientes-web.html";
    }

    @GetMapping("/produtos-web")
    public String produtosWeb() {
        return "forward:/produtos-web.html";
    }

    @GetMapping("/pedidos-web")
    public String pedidosWeb() {
        return "forward:/pedidos-web.html";
    }
}
