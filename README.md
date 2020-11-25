Happy Birthday Scratch Game
============================

Wish your friend, cousin, lover or whoever you want an happy birthday like a pro!

See https://happy-birthday.bouchereau.pro for a demo.

How to customize
----------------

Edit the configuration.js file to add as many games as you want. You need at least:
 * **imagePath** : the picture to scratch
 * **backgroundImagePath** : the background behind the message when the image is scratch
 * **message** : the message (either it's a win or a loss)

```javascript
games: [
        {
            imagePath: "images/my-sctrach-image.png",
            backgroundImagePath: "images/orange-opacity.png",
            message: "Ca alors,<br> ninja-sushis a mangé une boîte!<br>Il n'en manquait pourtant <br>qu'une seule pour gagner..."
        },
        ...
    ]
```

That's pretty much it right now!

How to run
----------

```bash
docker run -p 8888:80 ovski/happy-birthday-scratch-game:latest
```

browse http://localhost:8888/

