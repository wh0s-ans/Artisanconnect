{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.postgresql_15
    pkgs.gcc
    pkgs.libpq
  ];
}
