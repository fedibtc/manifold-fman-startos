# The manifold image is Nix-built and minimal: no shell, no /etc/passwd.
# StartOS's SubContainer runtime and the bundled fedimintd's libc name lookups
# (getpwuid via arti fs-mistrust) need real /etc/passwd, /etc/group, and
# /etc/nsswitch.conf, so stage them with COPY — a RUN would fail in the
# shell-less base image.
ARG FMAN_IMAGE=f06c7bbdb1bd3372858358d8ed9dda0855065213
FROM alpine:3.20 AS etcfix
RUN mkdir -p /out/etc \
  && printf 'root:x:0:0:root:/root:/sbin/nologin\n' > /out/etc/passwd \
  && printf 'root:x:0:\n' > /out/etc/group \
  && printf 'passwd: files\ngroup: files\nhosts: files dns\n' > /out/etc/nsswitch.conf

# Production supplies its own pin through the manifest's build argument.
FROM ghcr.io/fedibtc/manifold-fman:${FMAN_IMAGE}
COPY --from=etcfix /out/etc/ /etc/
