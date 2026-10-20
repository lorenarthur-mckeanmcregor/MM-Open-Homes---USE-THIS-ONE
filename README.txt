McKean McGregor open homes card service
=======================================

What it does
- /api/card?n=1 ... n=40   An image of the 1st to 40th open home on mckeanmcgregor.com.au/openhomes?type=sale,
                           drawn in the website style. Empty slots return an invisible 1 pixel image.
- /api/go?n=1 ... n=40     Sends the reader to that open home's listing page (or the open homes page if the slot is empty).
- /api/list                Plain text list of what the service currently reads from the open homes page. Use it to check.

It reads the public open homes page only. No Rex login or API key is used or stored.
It keeps a copy of the page for 5 minutes, so the website is not hit on every email open.

Deploy (about 15 minutes, all in the browser)
1. Go to github.com, sign up (free) or sign in.
2. Click "New repository", name it mm-open-homes-cards, choose Private, click "Create repository".
3. On the next page click "uploading an existing file". Drag in everything from this folder
   (the api folder, the lib folder, package.json and this README). Click "Commit changes".
4. Go to vercel.com, sign up with your GitHub account (free Hobby plan).
5. Click "Add New..." then "Project", pick mm-open-homes-cards, click "Deploy". Leave every setting as it is.
6. When it finishes, Vercel shows the address, something like https://mm-open-homes-cards.vercel.app

Check it
- Open https://YOUR-ADDRESS/api/list  : you should see this week's open homes listed.
- Open https://YOUR-ADDRESS/api/card?n=1 : you should see the first open home as a card image.
- Open https://YOUR-ADDRESS/api/go?n=1 : it should open that listing on the website.

Then send the address to Claude, who will put it into the Rex open homes template.
