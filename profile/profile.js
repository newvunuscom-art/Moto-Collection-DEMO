const profileForm =
    document.querySelector("#profile-form");


/* โหลดข้อมูลผู้ใช้ */
async function loadProfile() {

    try {

        const response =
            await fetch(
                "../api/me.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

        const result =
            await response.json();

        console.log("Profile:", result);


        if (!result.success) {

            alert("กรุณาเข้าสู่ระบบก่อน");

            window.location.href =
                "../login/login.html";

            return;
        }


        const user = result.user;


        document.querySelector("#username").value =
            user.username || "";

        document.querySelector("#email").value =
            user.email || "";

        document.querySelector("#name").value =
            user.name || "";

        document.querySelector("#phone").value =
            user.phone || "";

        document.querySelector("#address").value =
            user.address || "";


    } catch (error) {

        console.error(error);

        alert("ไม่สามารถโหลดข้อมูลได้");

    }

}


loadProfile();


profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            document.querySelector("#username")
                .value.trim();

        const email =
            document.querySelector("#email")
                .value.trim();

        const name =
            document.querySelector("#name")
                .value.trim();

        const phone =
            document.querySelector("#phone")
                .value.trim();

        const address =
            document.querySelector("#address")
                .value.trim();

        const password =
            document.querySelector("#password")
                .value;


        try {

            const response =
                await fetch(
                    "../api/update-profile.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            username: username,

                            email: email,

                            name: name,

                            phone: phone,

                            address: address,

                            password: password

                        })
                    }
                );


            const result =
                await response.json();


            console.log(
                "Update:",
                result
            );


            if (result.success) {

                alert(
                    "แก้ไขข้อมูลสำเร็จ"
                );

                window.location.href =
                    "../main/main.html";

            } else {

                alert(result.message);

            }


        } catch (error) {

            console.error(error);

            alert(
                "ไม่สามารถเชื่อมต่อ Server ได้"
            );

        }

    }
);