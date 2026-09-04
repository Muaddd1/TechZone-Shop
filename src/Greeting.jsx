function Greeting({ name, age, city }) {
return (
    <div>
    <h2>Hello, {name}!</h2>
    <p>You are {age} years old.</p>
    <p>You live in {city}.</p>
    </div>
);
}

export default Greeting;