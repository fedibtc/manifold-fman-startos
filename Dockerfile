# The manifold image is Nix-built and minimal: no shell, no /etc/passwd.
# StartOS's SubContainer runtime and the bundled fedimintd's libc name lookups
# (getpwuid via arti fs-mistrust) need real /etc/passwd, /etc/group, and
# /etc/nsswitch.conf, so stage them with COPY — a RUN would fail in the
# shell-less base image.
FROM alpine:3.20 AS etcfix
RUN mkdir -p /out/etc \
  && printf 'root:x:0:0:root:/root:/sbin/nologin\n' > /out/etc/passwd \
  && printf 'root:x:0:\n' > /out/etc/group \
  && printf 'passwd: files\ngroup: files\nhosts: files dns\n' > /out/etc/nsswitch.conf

# The staging Fleet Manager image published by manifold CI on every master
# merge (multi-arch, amd64 + arm64, public). Update the pin per UPDATING.md.
FROM ghcr.io/fedibtc/manifold-fman:1bd22f38e2a17519742c12fd449aa8e87ffb48f2
COPY --from=etcfix /out/etc/ /etc/
