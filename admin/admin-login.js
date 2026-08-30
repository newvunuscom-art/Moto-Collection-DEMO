const form = document.querySelector("#admin-login-form");

const message = document.querySelector("#message");

form.addEventListener(
    "submit",
    async  function (event){

        event.preventDefault();


        const username =
            document.querySelector("#username")
                .value
                .trim();


        const password =
            document.querySelector("#password")
            .value;

            console.log("Username:", username);
            console.log("Password:", password);

            message.textContent = "กำลังเข้าสู่ระบบ";
            
            try {

            const response =
                await fetch(
                    "../api/admin-login.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            username: username,

                            password: password

                        })
                    }
                );
                const result = await response.json();

            console.log(
                "Admin Login:",
                result
            );


            if (result.success) {

                window.location.href ="admin.html";

            } else {

                message.textContent =
                    result.message;

            }


        } catch (error) {

            console.error(error);

            message.textContent =
                "ไม่สามารถเชื่อมต่อ Server ได้";

        }
    }
);

