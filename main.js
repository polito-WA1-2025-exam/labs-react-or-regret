import dayjs from 'dayjs';

const Base = Object.freeze({
    RICE: "Rice",
    BLACK_RICE: "Black Rice",
    SALAD: "Salad"
});

const Proteins = Object.freeze({
    TUNA: "Tuna",
    Chicken: "Chicken",
    Salmon: "Salmon",
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

function Poke(size){
    this.size = size;
    this.base = "";
    this.proteins = [];
    this.ingredients = [];
    this.price = ((size === 1) ? 9 : ( (size === 2 )? 11 :  14) );
    this.extra_price = 0;


    this.addBase = (base) => {
        this.base = base;
    }

    this.addProtein = (protein) => {
        this.proteins.push(protein);
    }

    this.addIngredient = (ingredient) => {
        this.ingredients.push(ingredient);
    }

    this.removeIngredient = (ingredient) => {
        this.ingredients = this.ingredients.filter( i => i !== ingredient);
    }
}



const poke = new Poke(1);
//console.log(poke);

console.log(dayjs('2025-03-14 14:30').format('DD/MM/YYYY HH:mm:ss'));


