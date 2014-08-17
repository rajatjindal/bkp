package Modules;

use strict;
use warnings;
use lib ".";
use YAML;
use English;

use constant TRUE => 1;
use constant FALSE => 0;

my %modules = (
    die => "Modules::DieModule",
    dispatch => "Modules::DispatchBillingModule",
    glue => "Modules::GluerModule",
    printing => "Modules::PrintingModule",
    stiching => "Modules::StitchingModule",
    corrogation => "Modules::CorrugationModule",
    hr => "Modules::HRModule",
    store => "Modules::StoreModule",
    accounts => "Modules::AccountsModule"
);

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

    my $obj;
    if(defined $modules{$args->{'module'}}) {
    	my $class = $modules{$args->{'module'}};
        eval {
            eval "require $class ";
            $obj = $class->new;
        };
    }
    
    if(!$obj) {
        return {code => 200, content => "module $$args{'module'} not currently supported"};
    }
    return $obj->get_jobs($args);
}

sub get_headers{
    my $self = shift;
    my $args = shift;
    
    if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }

    my $obj;
    if(defined $modules{$args->{'module'}}) {
    	my $class = $modules{$args->{'module'}};
        eval {
            eval "require $class ";
            $obj = $class->new;
        };
    }
    
    if(!$obj) {
        return {code => 400, content => "module $$args{'module'} not currently supported. $EVAL_ERROR"};
    }
    return $obj->get_headers($args);
}

sub add_job {
    my $self = shift;
    my $args = shift;
    
        if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }
    
    if (!$$args{'date'}) {
        return {code => 400, content => "date missing"}
    }

    my $obj;
    if(defined $modules{$args->{'module'}}) {
    	my $class = $modules{$args->{'module'}};
        eval {
            eval "require $class ";
            $obj = $class->new;
        };
    }
    
    if(!$obj) {
        return {code => 200, content => "module $$args{'module'} not currently supported"};
    }
    return $obj->add_job($args);
}

sub edit_job {
    my $self = shift;
    my $args = shift;
    
    if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }
    
    if (!$$args{'date'}) {
        return {code => 400, content => "date missing"}
    }

    my $obj;
    if(defined $modules{$args->{'module'}}) {
    	my $class = $modules{$args->{'module'}};
        eval {
            eval "require $class ";
            $obj = $class->new;
        };
    }
    
    if(!$obj) {
        return {code => 200, content => "module $$args{'module'} not currently supported"};
    }
    return $obj->edit_job($args);
}

sub delete_job {
    my $self = shift;
    my $args = shift;
    
    if (!$$args{'module'}) {
        return {code => 400, content => "module missing"}
    }
    
    if (!$$args{'date'}) {
        return {code => 400, content => "date missing"}
    }

    my $obj;
    if(defined $modules{$args->{'module'}}) {
    	my $class = $modules{$args->{'module'}};
        eval {
            eval "require $class ";
            $obj = $class->new;
        };
    }
    
    if(!$obj) {
        return {code => 200, content => "module $$args{'module'} not currently supported"};
    }
    return $obj->delete_job($args);
}

1;