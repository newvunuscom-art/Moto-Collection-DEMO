
console.log("login.js ทำงานแล้ว");

const loginForm = document.querySelector("#login-form");

console.log("loginForm:", loginForm);

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

         try {

        const response = await fetch(
            "../api/login.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },
                credentials:"include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.json();

        console.log("Login:", result);

         if (result.success) {

            alert("สมัครสมาชิกสำเร็จ");

            window.location.href =
                "../main/main.html";

        } else {    

            alert(result.message);

        }

    } catch (error) {
        
        console.error("Login Error", error);

        alert("error" + error.message);
    }
}

);