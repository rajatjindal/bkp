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
    my $args = shift;
    
    if (!$$args{'email'}) {
        return {code => 400, content => "email missing"}
    }
    
    if (!$$args{'password'}) {
        return {code => 400, content => "password missing"}
    }
    
    my $users = $self->{_users};
    if(!exists $$users{$$args{'email'}}) {
        return {code => 401, content => "Invalid username or password"}
    }
    
    if($$users{$$args{'email'}}{'auth'}{'password'} ne $$args{'password'}) {
        return {code => 401, content => "Invalid username or password"}
    }
    return { code => 200, content => [keys $self->{_users}]};
}

1;