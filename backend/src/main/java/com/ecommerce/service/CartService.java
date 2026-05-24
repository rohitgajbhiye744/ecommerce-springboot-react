package com.ecommerce.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.repository.CartRepository;

@Service
public class CartService {
	@Autowired
	private CartRepository cartRepository ; 
	
	public Cart addToCart(int userId , int productId , int quantity) {
		Cart cart = cartRepository.findByUserId(userId);
		if(cart == null) {
			cart = new Cart();
			cart.setUserId(userId);
			cart.setItems(new ArrayList<>());
		}
		
		
		CartItem cItem = new CartItem();
		cItem.setProductId(productId);
		cItem.setQuantity(quantity);
		
		cart.getItems().add(cItem);

		return cartRepository.save(cart);
	}
	
	public Cart getCart(int userId) {
		return cartRepository.findByUserId(userId);
	}

	public void clearCart(int userId) {
		Cart cart = cartRepository.findByUserId(userId);
		if (cart != null && cart.getItems() != null) {
			cart.getItems().clear();
			cartRepository.save(cart);
		}
	}

}
