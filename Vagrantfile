NAME = "cybergoose"

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  # Machine name
  config.vm.define NAME
  config.vm.provider "virtualbox" do |v|
    v.name = NAME
  end

  # Networking
  config.vm.network :private_network, type: "dhcp"
  config.vm.hostname = NAME + ".local"

  # Use host DNS resolver
  # We use avahi to support theme.local addresses, but it causes slow DNS
  # lookups. Telling VirtualBox to use the host's DNS resolver fixes this.
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  end

  # Shared folders
  config.vm.synced_folder ".", "/data", create: true
  config.vm.synced_folder "./app", "/app", create: true

  # Provisioning
  config.vm.provision :shell, :path => "vagrant-provision.sh"
end
