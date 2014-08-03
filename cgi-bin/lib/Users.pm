package Users;

use strict;
use warnings;
use lib ".";
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
    
    my $user = $$users{$$args{'email'}};
    if($user->{'auth'}{'password'} ne $$args{'password'}) {
        return {code => 401, content => "Invalid username or password"}
    }
    return { code => 200, content => [keys %{$user->{'modules'}}]};
}

1;