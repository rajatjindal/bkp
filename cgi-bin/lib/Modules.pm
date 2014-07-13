package Modules;

use strict;
use warnings;
use lib ".";
use YAML;

sub new {
    my $class = shift;
    my $self;
    $self = bless {}, $class;
    return $self;
}

sub get_jobs {
    my $self = shift;
    my $args = shift;
    
    if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }
    
    if (!$$args{'date'}) {
        return {code => 400, content => "date missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    
    -e $file || return { code => 404, content => "No information found for $$args{'module'} for date $$args{'date'}"};
    my $data = YAML::LoadFile($file);
    
    return { code => 200, content => $data};
}

sub get_headers{
    my $self = shift;
    my $args = shift;
    
    if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/headers.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    my $data = YAML::LoadFile($file);
    return { code => 200, content => $data};
}

1;