package Users;

use strict;
use warnings;
use YAML;

sub new {
    my $class = shift;
    my $self;
    $self = bless {}, $class;
    
    $self->{_users} = YAML::LoadFile('data/auth/users.yaml');
    return $self;
}

sub get_users {
    my $self = shift;
    
    return { code => 200, content => [keys $self->{_users}]};
}

1;