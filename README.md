# Group "GROUP NAME"

## Members
- s123456 LASTNAME FIRSTNAME
- s123456 LASTNAME FIRSTNAME
- s123456 LASTNAME FIRSTNAME

# Exercise "NAME OF EXERCISE"

# Lab Journal

07/03/2025
LAB 1

Oggetti da creare:
 - Poke
 - Order
 - User

Gestiamo Proteins, Ingredients and Base come enum, con valori predefiniti.

------------------

14/03/2025
LAB 2

Tabelle da creare:
 - Poke (id, size, base, proteins, ingredients, price, extraPrice, orderId)
 - Order (id, data, userId, totalPrice (da valutare))
 - User (id, username, password, email)

 Per creare le Foreing Keys, una volta selezionata la reference, premi invio per salvare le modifiche, altrimenti - premendo solamente ok - la reference non verrà salvata e il db non potrà essere riempito.

pokeHeaders (id, sizeID)
pokeComposition (id, pokeID, elementID)
sizes (id, size, basesNr, proteinsNr, ingredientsNr, basePrice, extraPerc)
elements (id, element, type)
orderHeaders (id, date, userID, orderPrice)
orderLines (id, orderID, pokeID, quantity)
users (id, email, password)