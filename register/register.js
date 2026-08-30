const registerForm = document.querySelector("#register-form");

console.log(registerForm);

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    console.log("กดสมัครสมาชิกแล้ว");

    const username =
        document.querySelector("#username").value.trim();

    const email =
        document.querySelector("#email").value.trim();

    const password =
        document.querySelector("#password").value;

    const name =
        document.querySelector("#name").value.trim();

    const phone =
        document.querySelector("#phone").value.trim();

    const address =
        document.querySelector("#address").value.trim();


    try {

        const response = await fetch(
            "../api/register.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    phone: phone,
                    address: address
                })
            }
        );


        const result = await response.json();


        if (result.success) {

            alert("สมัครสมาชิกสำเร็จ");

            window.location.href =
                "../login/login.html";

        } else {

            alert(result.message);

        }


    } catch (error) {

        console.error(error);

        alert("ไม่สามารถเชื่อมต่อ Server ได้");

    }

});