package com.baozistore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baozistore.model.Pedido;
import com.baozistore.repository.ClienteRepository;
import com.baozistore.repository.PedidoRepository;
import com.baozistore.repository.ProdutoRepository;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoController(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Pedido pedido) {
        if (!clienteRepository.existsById(pedido.getClienteId())) {
            return ResponseEntity.badRequest().body("Cliente não encontrado para o ID informado.");
        }
        if (!produtoRepository.existsById(pedido.getProdutoId())) {
            return ResponseEntity.badRequest().body("Produto não encontrado para o ID informado.");
        }
        if (pedido.getQuantidade() == null || pedido.getQuantidade() <= 0) {
            return ResponseEntity.badRequest().body("A quantidade deve ser maior que zero.");
        }
        return ResponseEntity.ok(pedidoRepository.save(pedido));
    }

    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Pedido dadosAtualizados) {
        if (!clienteRepository.existsById(dadosAtualizados.getClienteId())) {
            return ResponseEntity.badRequest().body("Cliente não encontrado para o ID informado.");
        }
        if (!produtoRepository.existsById(dadosAtualizados.getProdutoId())) {
            return ResponseEntity.badRequest().body("Produto não encontrado para o ID informado.");
        }
        if (dadosAtualizados.getQuantidade() == null || dadosAtualizados.getQuantidade() <= 0) {
            return ResponseEntity.badRequest().body("A quantidade deve ser maior que zero.");
        }
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    pedido.setClienteId(dadosAtualizados.getClienteId());
                    pedido.setProdutoId(dadosAtualizados.getProdutoId());
                    pedido.setQuantidade(dadosAtualizados.getQuantidade());
                    Pedido pedidoSalvo = pedidoRepository.save(pedido);
                    return ResponseEntity.ok(pedidoSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!pedidoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pedidoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
