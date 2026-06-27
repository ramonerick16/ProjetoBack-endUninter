package com.baozistore.config;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.baozistore.model.Cliente;
import com.baozistore.model.Pedido;
import com.baozistore.model.Produto;
import com.baozistore.repository.ClienteRepository;
import com.baozistore.repository.PedidoRepository;
import com.baozistore.repository.ProdutoRepository;

@Configuration
public class DadosIniciais {

    @Bean
    CommandLineRunner carregarDados(ClienteRepository clienteRepository, ProdutoRepository produtoRepository,
            PedidoRepository pedidoRepository) {
        return args -> {
            if (clienteRepository.count() == 0) {
                Cliente cliente = new Cliente(null, "Erick Ramon Alves da Silveira e Silva5021939", LocalDate.now());
                clienteRepository.save(cliente);
            }

            if (produtoRepository.count() == 0) {
                Produto produto = new Produto(null, "Baozi Tradicional de Carne Suína", new BigDecimal("12.90"), true);
                produtoRepository.save(produto);
            }

            if (pedidoRepository.count() == 0 && clienteRepository.existsById(1L) && produtoRepository.existsById(1L)) {
                Pedido pedido = new Pedido(null, 1L, 1L, 6);
                pedidoRepository.save(pedido);
            }
        };
    }
}
