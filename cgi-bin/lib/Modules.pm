package Modules;

use strict;
use warnings;
use lib ".";
use YAML;

use constant TRUE => 1;
use constant FALSE => 0;

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

sub add_job {
    my $self = shift;
    my $args = shift;
    
    my @mandatory = ("Job Name", "Job Desc", "Number requested");
    
    if (!defined $args->{'module'}) {
        return {code => 400, content => "module is missing"}
    }
    
    if (!defined $args->{'category'}) {
        return {code => 400, content => "category is missing"}
    }
    
    foreach my $mField(@mandatory) {
        if (!defined $args->{$mField}) {
            return {code => 400, content => "$mField is mandatory"}
        }
    }
    
    if (!defined $args->{'date'}) {
        return {code => 400, content => "date is missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    
    my $data = YAML::LoadFile($file);
    if ($self->is_locked($file)) {
        return {code => 409, content => "someone else is editing this too. Please try in some seconds."}
    }
    
    $self->lock_file($file);
    #return {code => 200, content => $data};
    foreach my $d (@{$data}) {
        my $category = (keys %{$d})[0];
        if ($category eq $args->{'category'}) {
            foreach my $job (@{$d->{$category}}) {
                if ($job->{'Job Name'} eq $args->{'Job Name'}) {
                    $self->release_file($file);
                    return {code => 409, content => $args->{'Job Name'}." already exists."}
                }
            }
            my %temp = ();
            $temp{'Job Name'} = $args->{'Job Name'};
            $temp{'Job Desc'} = $args->{'Job Desc'};
            $temp{'Number requested'} = $args->{'Number requested'};
            
            if (exists $args->{'start date'}) {
                $temp{'Job put on the machine at'} = $args->{'start date'};
            } else {
                $temp{'Job put on the machine at'} = "";
            }
            
            if (exists $args->{'end date'}) {
                $temp{'Job put off the machine at'} = $args->{'end date'};
            } else {
                $temp{'Job put off the machine at'} = "";
            }
            
            if (exists $args->{'Number Achieved'}) {
                $temp{'Number Achieved'} = $args->{'Number Achieved'};
            } else {
                $temp{'Number Achieved'} = "";
            }
            
            push(@{$d->{$category}}, \%temp);
            YAML::DumpFile($file, $data);
            $self->release_file($file);
            return {code => 200, content => "updated successfully"};
        }
    }
    $self->release_file($file);
    return {code => 400, content => "category: ".$args->{'category'}." not found for module: ".$args->{'module'}}
}

sub edit_job {
    my $self = shift;
    my $args = shift;
    
    my @mandatory = ("Job Name", "Job Desc", "Number requested");
    
    if (!defined $args->{'module'}) {
        return {code => 400, content => "module is missing"}
    }
    
    if (!defined $args->{'category'}) {
        return {code => 400, content => "category is missing"}
    }
    
    foreach my $mField(@mandatory) {
        if (!defined $args->{$mField}) {
            return {code => 400, content => "$mField is mandatory"}
        }
    }
    
    if (!defined $args->{'date'}) {
        return {code => 400, content => "date is missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    
    my $data = YAML::LoadFile($file);
    if ($self->is_locked($file)) {
        return {code => 409, content => "someone else is editing this too. Please try in some seconds."}
    }
    
    $self->lock_file($file);
    #return {code => 200, content => $data};
    foreach my $d (@{$data}) {
        my $category = (keys %{$d})[0];
        if ($category eq $args->{'category'}) {
            foreach my $job (@{$d->{$category}}) {
                if ($job->{'Job Name'} eq $args->{'Job Name'}) {
                    $job->{'Job Desc'} = $args->{'Job Desc'};
                    $job->{'Number requested'} = $args->{'Number requested'};
            
                    if (exists $args->{'start date'}) {
                        $job->{'Job put on the machine at'} = $args->{'start date'};
                    }
            
                    if (exists $args->{'end date'}) {
                        $job->{'Job put off the machine at'} = $args->{'end date'};
                    }
            
                    if (exists $args->{'Number Achieved'}) {
                        $job->{'Number Achieved'} = $args->{'Number Achieved'};
                    }
            
                    YAML::DumpFile($file, $data);
                    $self->release_file($file);
                    return {code => 200, content => "updated successfully"};
                }
            }
            $self->release_file($file);
            return {code => 400, content => $args->{'Job Name'}." not found in ". "category: ".$args->{'category'}.", module: ".$args->{'module'}}
        }
    }
    $self->release_file($file);
    return {code => 400, content => "category: ".$args->{'category'}." not found for module: ".$args->{'module'}}
}

sub delete_job {
    my $self = shift;
    my $args = shift;
    
    my @mandatory = ("Job Name");
    
    if (!defined $args->{'module'}) {
        return {code => 400, content => "module is missing"}
    }
    
    if (!defined $args->{'category'}) {
        return {code => 400, content => "category is missing"}
    }
    
    foreach my $mField(@mandatory) {
        if (!defined $args->{$mField}) {
            return {code => 400, content => "$mField is mandatory"}
        }
    }
    
    if (!defined $args->{'date'}) {
        return {code => 400, content => "date is missing"}
    }
    
    my $file = "data/modules/$$args{'module'}/$$args{'date'}.yaml";
    -e $file || return { code => 404, content => "No header information found for $$args{'module'}"};
    
    my $data = YAML::LoadFile($file);
    if ($self->is_locked($file)) {
        return {code => 409, content => "someone else is editing this too. Please try in some seconds."}
    }
    
    $self->lock_file($file);
    #return {code => 200, content => $data};
    foreach my $d (@{$data}) {
        my $category = (keys %{$d})[0];
        if ($category eq $args->{'category'}) {
            my $index = 0;
            foreach my $job (@{$d->{$category}}) {
                if ($job->{'Job Name'} eq $args->{'Job Name'}) {
                    delete $d->{$category}->[$index];
                    YAML::DumpFile($file, $data);
                    $self->release_file($file);
                    return {code => 204, content => "deleted successfully"}
                }
                $index++;
            }
            $self->release_file($file);
            return {code => 400, content => $args->{'Job Name'}." not found in ". "category: ".$args->{'category'}.", module: ".$args->{'module'}}
        }
    }
    $self->release_file($file);
    return {code => 400, content => "category: ".$args->{'category'}." not found for module: ".$args->{'module'}}
}

sub is_locked {
    my $self = shift;
    my $file = shift;
    
    my $lock = $file.".lock";
    if (-e $lock) {
        return TRUE;
    }
    return FALSE;
}

sub lock_file {
    my $self = shift;
    my $file = shift;
    
    my $lock = $file.".lock";
    open(F, ">$lock");
    close F;
}

sub release_file {
    my $self = shift;
    my $file = shift;
    
    my $lock = $file.".lock";
    unlink $lock;
}

1;