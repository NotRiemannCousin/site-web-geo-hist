<?php
// R::setup('mysql:host=localhost;dbname=mydatabase', 'user', 'password'); 

// if (!isset($_GET['conflict']) && R::load('page', "$_GET[conflict] = name"))
if (!isset($_GET['conflict'])) {
    header('location: index.html');
    die;
}

// $conflito = R::load('page', "$_GET[conflict] = name");

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- <link href="style.css" rel="stylesheet" type="text/css" /> -->
    <link href="res/style/basic.css" rel="stylesheet" type="text/css" />
    <script src="script.js"></script>
</head>

<body>
    <header>
        <h1> Mapa dos Conflitos Mundiais</h1>
        <!-- <h1> ?= $conflito->nome ?></h1> -->
    </header>
    <main>
    </main>
    <aside>
    </aside>
    <footer>&copy; Marcelo Henrique, Vitor Hugo, Pablo Vinicius - 2022</footer>
</body>

</html>