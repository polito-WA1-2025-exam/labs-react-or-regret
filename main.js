import dayjs from 'dayjs';

const Base = Object.freeze({
    RICE: "Rice",
    BLACK_RICE: "Black Rice",
    SALAD: "Salad"
});

const Proteins = Object.freeze({
    TUNA: "Tuna",
    CHICKEN: "Chicken",
    SALMON: "Salmon",
    TOFU: "Tofu"
});

const Ingredients  = Object.freeze({
    AVOCADO: "Avocado",
    ANANAS: "Ananas",
    CASHEW_NUTS: "Cashew Nuts",
    KALE: "Kale",
    MANGO: "Mango",
    PEPPERS: "Peppers",
    CORN: "Corn",
    WAKAME: "Wakame",
    TOMATOES: "Tomatoes",
    CARROTS: "Carrots",
    SALAD: "Salad",
});

class User {
    constructor(id, name, surname, email) {
        this.id = id;
        this.name = name;
        this.surname = surname
        this.email = email;
    }

}

class Poke {
    constructor(size) {
        this.size = size;
        this.base = null;
        this.proteins = [];
        this.ingredients = [];
        this.price = { 1: 9, 2: 11, 3: 14 }[size] || 0;
        this.extra_price = 0;
    }

    setBase(base) {
        if (Object.values(Base).includes(base)) {
            this.base = base;
        } else {
            throw new Error("Invalid base selection");
        }
    }

    changeBase(newBase) {
        // Verifica che la nuova base sia valida
        if (Object.values(Base).includes(newBase)) {
            this.base = newBase; // Cambia la base con la nuova base
        } else {
            throw new Error("Invalid base selection");
        }
    }

    addProtein(protein) {
        // Verifica che la proteina sia valida
        if (!Object.values(Proteins).includes(protein)) {
            throw new Error("Invalid protein selection");
        }

        // Limiti di proteine per dimensione
        const maxProteins = { 1: 1, 2: 2, 3: 3 }; // 1 proteina per R, 2 per M, 3 per L
        if (this.proteins.length < maxProteins[this.size]) {
            this.proteins.push(protein);
        } else {
            throw new Error("Invalid protein selection or limit reached");
        }
    }

    removeProtein(protein) {
        const index = this.proteins.indexOf(protein);
        if (index !== -1) {
            this.proteins.splice(index, 1);
            this.updatePrice(); // Ricalcola il prezzo dopo aver rimosso il protein
        } else {
            throw new Error("Protein not found in the list");
        }
    }

    addIngredient(ingredient) {
        if (Object.values(Ingredients).includes(ingredient)) {
            this.ingredients.push(ingredient);
            this.updatePrice();
        } else {
            throw new Error("Invalid ingredient selection");
        }
    }

    removeIngredient(ingredient) {
        this.ingredients = this.ingredients.filter(i => i !== ingredient);
        this.updatePrice();
    }

    updatePrice() {
        const maxIngredients = { 1: 4, 2: 4, 3: 6 };
        let extraIngredients = Math.max(0, this.ingredients.length - maxIngredients[this.size]);
        this.extra_price = (this.price * 0.2) * extraIngredients;
    }

    getPrice() {
        if (this.ingredients.length === 0) {
            throw new Error("At least one ingredient is required.");
        }
        return this.price + this.extra_price;
    }
}

class Order {
    constructor(user) {
        this.user = user;
        this.pokeBowls = [];
        this.createdAt = dayjs().format('DD/MM/YYYY HH:mm:ss');
        // Limiti giornalieri di poke bowls per ogni dimensione
        this.maxPokeAvailability = {
            1: 10, // 10 Regular bowls
            2: 8,  // 8 Medium bowls
            3: 6   // 6 Large bowls
        };

        // Conta le quantità di poke aggiunti per ogni dimensione
        this.pokeCount = {
            1: 0,  // Regular count
            2: 0,  // Medium count
            3: 0   // Large count
        };
    }

    addPoke(poke) {
        // Verifica la disponibilità per la dimensione del poke
        if (this.pokeCount[poke.size] < this.maxPokeAvailability[poke.size]) {
            this.pokeBowls.push(poke);
            this.pokeCount[poke.size] += 1; // Aggiunge un poke della dimensione corrispondente
        } else {
            throw new Error(`Non ci sono abbastanza poke bowls di dimensione ${poke.size} disponibili. Limite massimo raggiunto.`);
        }
    }

    removePoke(poke) {
        // Rimuove un poke specifico dall'ordine
        const index = this.pokeBowls.indexOf(poke);
        if (index !== -1) {
            this.pokeBowls.splice(index, 1);
        } else {
            throw new Error("Poke not found in the order.");
        }
    }

    cancelOrder() {
        // Annulla l'ordine, cambiando lo stato
        this.status = "cancelled";
    }

    getTotalPrice() {
        let total = this.pokeBowls.reduce((sum, poke) => sum + poke.getPrice(), 0);
        if (this.pokeBowls.length > 4) {
            total *= 0.9; // Sconto se l'ordine ha più di 4 poke
        }
        return total;
    }

    getOrderSummary() {
        // Restituisce un riassunto completo dell'ordine
        const totalPrice = this.getTotalPrice();
        const orderDetails = this.pokeBowls.map((poke, index) => ({
            pokeIndex: index + 1,
            size: poke.size,
            base: poke.base,
            proteins: poke.proteins,
            ingredients: poke.ingredients,
            price: poke.getPrice()
        }));
        return {
            orderDetails,
            totalPrice,
            createdAt: this.createdAt
        };
    }
}


// Crea degli utenti
const user1 = new User(1, "John", "Doe", "john.doe@example.com");
const user2 = new User(2, "Jane", "Smith", "jane.smith@example.com");

// Crea dei Poke
const poke1 = new Poke(1); // Regular bowl
poke1.setBase(Base.RICE);
poke1.addProtein(Proteins.TUNA);
poke1.addIngredient(Ingredients.AVOCADO);
poke1.addIngredient(Ingredients.CARROTS);

const poke2 = new Poke(2); // Medium bowl
poke2.setBase(Base.BLACK_RICE);
poke2.addProtein(Proteins.CHICKEN);
poke2.addIngredient(Ingredients.MANGO);
poke2.addIngredient(Ingredients.TOMATOES);
poke2.addIngredient(Ingredients.CASHEW_NUTS);

const poke3 = new Poke(3); // Large bowl
poke3.setBase(Base.SALAD);
poke3.addProtein(Proteins.SALMON);
poke3.addIngredient(Ingredients.KALE);
poke3.addIngredient(Ingredients.PEPPERS);
poke3.addIngredient(Ingredients.CORN);
poke3.addIngredient(Ingredients.WAKAME);

// Crea un ordine
const order1 = new Order(user1);
order1.addPoke(poke1);
order1.addPoke(poke2);
order1.addPoke(poke3);

console.log("First Order Summary:");
console.log(order1.getOrderSummary());

console.log("\nTry to add more poke bowls to the first order:");

try {
    // Proviamo a inserire più poke bowls di quelli consentiti (es. 9 R)
    const poke4 = new Poke(1); // Regular bowl
    poke4.setBase(Base.SALAD);
    poke4.addProtein(Proteins.TOFU);
    poke4.addIngredient(Ingredients.ANANAS);
    order1.addPoke(poke4); // Non dovrebbe essere aggiunto, superiamo il limite!
} catch (error) {
    console.log("Error: " + error.message);
}

console.log("\nAdding more poke bowls to a second order:");

const order2 = new Order(user2);
order2.addPoke(poke1);
order2.addPoke(poke2);

console.log("Second Order Summary:");
console.log(order2.getOrderSummary());

console.log("\nRemoving a poke from the second order:");

try {
    order2.removePoke(poke1); // Rimuove un poke dalla seconda ordine
    console.log("Second order after removal:");
    console.log(order2.getOrderSummary());
} catch (error) {
    console.log("Error: " + error.message);
}

console.log("\nTrying to add poke after max quantity reached:");

const poke5 = new Poke(1); // Regular bowl
poke5.setBase(Base.RICE);
poke5.addProtein(Proteins.TUNA);
poke5.addIngredient(Ingredients.PEPPERS);
try {
    order2.addPoke(poke5); // Non dovrebbe essere aggiunto per via del limite
} catch (error) {
    console.log("Error: " + error.message);
}


const pokeLarge1 = new Poke(3); // Large
pokeLarge1.setBase(Base.RICE);
pokeLarge1.addProtein(Proteins.TUNA);
pokeLarge1.addProtein(Proteins.CHICKEN);
pokeLarge1.addProtein(Proteins.SALMON);
pokeLarge1.addIngredient(Ingredients.AVOCADO);
pokeLarge1.addIngredient(Ingredients.CASHEW_NUTS);
pokeLarge1.addIngredient(Ingredients.KALE);

// Ripetiamo per creare 6 Poke bowls Large (modificare ingredienti per variare)
const pokeLarge2 = new Poke(3);
pokeLarge2.setBase(Base.BLACK_RICE);
pokeLarge2.addProtein(Proteins.TUNA);
pokeLarge2.addProtein(Proteins.TOFU);
pokeLarge2.addProtein(Proteins.SALMON);
pokeLarge2.addIngredient(Ingredients.MANGO);
pokeLarge2.addIngredient(Ingredients.PEPPERS);
pokeLarge2.addIngredient(Ingredients.CORN);

// Aggiungere altri 4 poke large con varianti
const pokeLarge3 = new Poke(3);
pokeLarge3.setBase(Base.SALAD);
pokeLarge3.addProtein(Proteins.CHICKEN);
pokeLarge3.addProtein(Proteins.TOFU);
pokeLarge3.addProtein(Proteins.TUNA);
pokeLarge3.addIngredient(Ingredients.TOMATOES);
pokeLarge3.addIngredient(Ingredients.ANANAS);
pokeLarge3.addIngredient(Ingredients.KALE);

const pokeLarge4 = new Poke(3);
pokeLarge4.setBase(Base.RICE);
pokeLarge4.addProtein(Proteins.SALMON);
pokeLarge4.addProtein(Proteins.TUNA);
pokeLarge4.addProtein(Proteins.TOFU);
pokeLarge4.addIngredient(Ingredients.CARROTS);
pokeLarge4.addIngredient(Ingredients.WAKAME);
pokeLarge4.addIngredient(Ingredients.CASHEW_NUTS);

const pokeLarge5 = new Poke(3);
pokeLarge5.setBase(Base.BLACK_RICE);
pokeLarge5.addProtein(Proteins.SALMON);
pokeLarge5.addProtein(Proteins.TUNA);
pokeLarge5.addProtein(Proteins.CHICKEN);
pokeLarge5.addIngredient(Ingredients.MANGO);
pokeLarge5.addIngredient(Ingredients.CORN);
pokeLarge5.addIngredient(Ingredients.PEPPERS);

const pokeLarge6 = new Poke(3);
pokeLarge6.setBase(Base.SALAD);
pokeLarge6.addProtein(Proteins.TOFU);
pokeLarge6.addProtein(Proteins.TUNA);
pokeLarge6.addProtein(Proteins.SALMON);
pokeLarge6.addIngredient(Ingredients.TOMATOES);
pokeLarge6.addIngredient(Ingredients.AVOCADO);
pokeLarge6.addIngredient(Ingredients.KALE);

const order = new Order(user1);

// Aggiungiamo le 6 Poke bowls di taglia Large all'ordine
order.addPoke(pokeLarge1);
order.addPoke(pokeLarge2);
order.addPoke(pokeLarge3);
order.addPoke(pokeLarge4);
order.addPoke(pokeLarge5);
order.addPoke(pokeLarge6);

console.log("Order with 6 Large Poke bowls:");

const pokeLarge7 = new Poke(3);
pokeLarge6.setBase(Base.SALAD);
pokeLarge6.addProtein(Proteins.TOFU);
pokeLarge6.addProtein(Proteins.TUNA);
pokeLarge6.addProtein(Proteins.SALMON);
pokeLarge6.addIngredient(Ingredients.TOMATOES);
pokeLarge6.addIngredient(Ingredients.AVOCADO);
pokeLarge6.addIngredient(Ingredients.KALE);

//order.addPoke(pokeLarge7); // Non dovrebbe essere aggiunto per via del limite


