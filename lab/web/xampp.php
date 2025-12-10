<!DOCTYPE html>
<html>
<head>
    <title>Kullanıcı Girişi</title>
</head>
<body>

    <?php
    // Tanımlanmış geçerli kimlik bilgileri (Gerçek uygulamalarda bu bir veritabanından alınır!)
    $dogru_email = "test@example.com";
    $dogru_sifre = "123456"; 

    // Formun POST metoduyla gönderilip gönderilmediğini kontrol et
    // $_POST süperglobal dizisi ile form verilerine erişilir [5].
    if (isset($_POST['email']) && isset($_POST['sifre'])) {
        
        // Formdan gelen verileri al
        $girilen_email = $_POST['email'];
        $girilen_sifre = $_POST['sifre'];

        // Kimlik bilgilerini karşılaştırma
        // Karşılaştırma operatörleri kullanılır [6].
        if ($girilen_email == $dogru_email && $girilen_sifre == $dogru_sifre) { 
            // Giriş başarılıysa
            echo "<h2>Giriş Başarılı! Hoş geldiniz.</h2>";
            
            // Eğer giriş başarılıysa, formun tekrar gösterilmesini engellemek için
            // veya kullanıcıyı başka bir sayfaya yönlendirmek için çıkış yapılır.
            // Bu örnekte, form yerine sadece başarı mesajı gösterilir.

        } else {
            // Giriş başarısızsa (Email veya Şifre yanlışsa)
            echo "<p style='color:red;'>Hata: E-posta veya şifre yanlış.</p>";
            // Formu tekrar göster
            include 'form_html.php'; // Alternatif olarak form aşağıda tekrar tanımlanır.
        }
    } else {
        // Form henüz gönderilmediyse veya eksik veri geldiyse, formu göster
        // PHP blokları koşul yapılarında kullanılabilir [7].
    ?>

        <h2>Lütfen Giriş Yapınız</h2>

        <!-- Formun action özelliği boş bırakılırsa, veriler aynı sayfaya POST edilir [8]. 
             Hassas veriler (şifre) için method mutlaka POST olmalıdır [1, 2]. -->
        <form method="POST" action=""> 
            
            <!-- E-posta girişi [3, 9] -->
            <label for="emailID">E-Posta Adresiniz:</label><br> 
            <input type="email" id="emailID" name="email" placeholder="Eposta giriniz" required><br><br>
            
            <!-- Şifre girişi [3, 9] -->
            <label for="parolaID">Parola:</label><br>
            <input type="password" id="parolaID" name="sifre" placeholder="Parola giriniz" required><br><br>
            
            <input type="submit" value="Giriş Yap"> 
        </form>

    <?php
    } // else bloğu biter (formu gösteren kısım)
    ?>

</body>
</html>