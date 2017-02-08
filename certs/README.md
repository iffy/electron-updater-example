These certificates were generated from the tool mentioned at the end of this blog post: <https://blog.didierstevens.com/2008/12/30/howto-make-your-own-cert-with-openssl/>

Tool: <https://toolbokz.com/gencert.psp>

Then we encode the `ia.p12` file as `ia.p12.base64` with this command:

    base64 -i ia.p12 -o ia.p12.base64