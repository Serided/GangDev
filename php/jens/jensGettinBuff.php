<head>
    <title></title>
    <meta charset="utf-8" />
    <style>
        #Tagthree {
        visibility:hidden;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
        $(function () {
            $("#Tagtwo").css("visibility", "hidden");
        })
    </script>

</head>
<body>
    <a id="Tagone" href="http://www.google.com" style="visibility:hidden">Tagone</a>
    <a id="Tagtwo" href="http://www.google.com">Tagtwo</a>
    <a id="Tagthree" href="http://www.google.com">Tagthree</a>
</body>